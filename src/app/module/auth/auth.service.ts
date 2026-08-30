import bcrypt from 'bcryptjs'
import { JwtPayload, SignOptions } from 'jsonwebtoken'
import { AuthProvider, Role, UserStatus } from '../../../generated/prisma/enums'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { jwtUtils } from '../../utils/jwt'
import {
    IGoogleLoginPayload,
    ILoginUserPayload,
    IRegisterPatientPayload,
    IRequestUser
} from './auth.interface'
import { OAuth2Client } from 'google-auth-library'
import { googleClient } from '../../lib/googleAuth'


const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { name, password } = payload
    const email = payload.email.trim().toLowerCase()

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    })

    if (isUserExists) {
        throw new Error('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.PATIENT,
            status: UserStatus.ACTIVE,
            emailVerified: false,
            patient: {
                create: { name, email },
            },
        },
        omit: { password: true },
        include: { patient: true },
    })

    const { patient, ...user } = createdUser
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        user,
        patient,
        accessToken,
        refreshToken
    }
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { password } = payload
    const email = payload.email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new Error('User not found')
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new Error('User is blocked')
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new Error('User is deleted')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password as string)

    if (!isPasswordMatched) {
        throw new Error('Invalid credentials')
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }
}

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            patient: true,
        },
        omit: {
            password: true,
        },
    })

    if (!isUserExists) {
        throw new Error('User not found')
    }

    return isUserExists
}

const refreshToken = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret)

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new Error(config.node_env === 'development' ? verifiedRefreshToken.error : 'Invalid refresh token')
    }

    const data = verifiedRefreshToken.data as JwtPayload

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    })

    if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
        throw new Error('User is inactive or not found')
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }
}




const googleLogin = async (payload: IGoogleLoginPayload) => {

    let googleTokenPayload = null
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: payload.idToken, audience: config.google_client_id });
        googleTokenPayload = ticket.getPayload()

    } catch (error) {
        console.log(`Google Authencation faild: ${error}`);
        throw new Error("Google Authencation faild")
    }


    if (!googleTokenPayload) {
        throw new Error("Invalid Google Token")
    }
    if (!googleTokenPayload.name) {
        throw new Error("Google Name Invalid")
    }
    if (!googleTokenPayload.email) {
        throw new Error("Google Email Invalid")
    }

    const isPatientExsistWithGoogle = await prisma.user.findUnique({
        where: {
            email: googleTokenPayload.email,
            role: Role.PATIENT,
            googleId: googleTokenPayload.sub

        }
    })


    let user = isPatientExsistWithGoogle;
    if (!isPatientExsistWithGoogle) {

        const isPatientExsistWithCredential = await prisma.user.findUnique({
            where: {
                email: googleTokenPayload.email,
                role: Role.PATIENT,
                authProvider: AuthProvider.CREDENTIAL
            }
        })
        if (isPatientExsistWithCredential?.status === UserStatus.BLOCKED) {
            throw new Error("User is Blocked")
        }
        if (isPatientExsistWithCredential?.status === UserStatus.DELETED || isPatientExsistWithCredential?.isDeleted) {
            throw new Error("User is Deleted")
        }
        if (isPatientExsistWithCredential) {
            user = await prisma.user.update({
                where: { id: isPatientExsistWithCredential.id },
                data: {
                    googleId: googleTokenPayload.sub
                }
            })

        }
        else {

            user = await prisma.user.create({
                data: {
                    name: googleTokenPayload.name,
                    email: googleTokenPayload.email,
                    role: Role.PATIENT,
                    googleId: googleTokenPayload.sub,
                    patient: {
                        create: {
                            name: googleTokenPayload.name,
                            email: googleTokenPayload.email,
                        }
                    }
                }
            })
        }



    };











    if (!user) {
        throw new Error("User Not Found!")
    }
    if (user?.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked")
    }
    if (user?.status === UserStatus.DELETED || user?.isDeleted) {
        throw new Error("User is Deleted")
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }


}




export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    refreshToken,
    googleLogin
}
