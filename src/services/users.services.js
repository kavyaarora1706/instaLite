const prisma = require('../db')

const createUSer = async (data)=>{
    return await prisma.user.create({data})
}

const listUsers = async()=>{
    return await prisma.user.findmany()
}

const getusers = async(id)=>{
    return await prisma.user.findUnique({
        where: {id}
    })
} 

const updateusers = async(id,data)=>{
    return await prisma.user.update({
        where: {id},
        data,
    })
}

const deleteusers = async(id)=>{
    return await prisma.user.delete({
        where: {id},
    })
}

module.exports = {
    createUSer,
    listUsers,
    getusers,
    updateusers,
    deleteusers
}