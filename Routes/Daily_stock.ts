import { prisma } from '../prisma'
import {Router} from 'express'
import {authMiddleware }from '../middleware/auth'
const router = Router()


router.get('/', async(req,res) =>{  
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 3        //public
    const DailyStocks = await prisma.daily_stock.findMany({
            skip: (page - 1) * limit,
            take: limit
    })
    res.json(DailyStocks)
})
router.get('/:id', async (req,res) =>{                //public
    const DailyStocks= await prisma.company.findUnique({
      where:{
        id: Number(req.params.id)
      }
    })
      res.json(DailyStocks)
    })

router.post('/', authMiddleware, async (req,res) =>{ //protectec
    console.log(req.body)
    const DailyStocks = await prisma.daily_stock.create({
    data: {
        company_id: req.body.company_id,
        date: new Date(req.body.date),
        close: Number(req.body.close)
    }
    })
    res.json(DailyStocks)
})
router.put('/:id', authMiddleware, async (req,res) =>{ ///proctecte
    const DailyStock = await prisma.daily_stock.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
    company_id:req.body.company_id,
    date: new Date(req.body.date),
    close:Number(req.body.close),
    }
  })
    res.json(DailyStock)
})

router.delete('/:id', authMiddleware, async (req,res) =>{ //protected
    await prisma.daily_stock.delete({
    where: {
      id: Number(req.params.id)
    }
  })
    res.json({
        message:`successfully deleted daily stock ${req.params.id}`
    })
})  
export default router 