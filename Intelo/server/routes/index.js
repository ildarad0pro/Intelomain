const Router = require('express')
const router = new Router()

const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const ecosystemRouter = require('./ecosystemRouter')
const kitRouter = require('./kitRouter')
const controlRouter = require('./controlRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/device', deviceRouter)
router.use('/ecosystem', ecosystemRouter)
router.use('/kit', kitRouter)
router.use('/control', controlRouter)


module.exports = router
