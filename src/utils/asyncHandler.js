

const asyncHandler=(requiestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requiestHandler(req,res,next)).catch((err)=> next(err))
    }
}
export {asyncHandler}