import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";



const profileImage = async (buffer: Buffer, userId: string) => {

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { imagePublicId: true, imageUrl: true }
    })

    cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        async (error, result) => {
            if (error) {
                throw new Error(error.message)
            }

            await prisma.user.update({
                where: { id: userId },
                data: {
                    imagePublicId: result?.public_id,
                    imageUrl: result?.secure_url
                }
            })

            if (currentUser?.imagePublicId && result?.public_id) {
                await cloudinary.uploader.destroy(currentUser?.imagePublicId, {
                    resource_type: "image",
                    invalidate: true
                })
            }
        }
    ).end(buffer)

    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true }
    })

    return user;
};





export const UserService = {
    profileImage
}