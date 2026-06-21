import { prisma } from '../prisma'
import {Router} from 'express'
import {authMiddleware }from '../middleware/auth'
const router = Router()


router.get('/', async(req,res) =>{   
      const page = Number(req.query.page) || 1         
      const limit = Number(req.query.limit) || 3    
      const company_id = Number(req.query.company_id)

      const where ={
        company_id:company_id || undefined
                }

      const total = await prisma.daily_stock.count({
          where
    })

      const DailyStocks = await prisma.daily_stock.findMany({
      select:{                                               
        company_id: true,
        date: true,
        close: true

      },
      where,
            skip: (page - 1) * limit,
            take: limit
    })
    res.json({
  data: DailyStocks,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
  })
})
router.get('/:id', async (req,res) =>{                //public
    const DailyStocks= await prisma.daily_stock.findUnique({
      where:{
        id: Number(req.params.id)
      }
    })
      res.json(DailyStocks)
    })

router.post('/', authMiddleware, async (req,res) =>{ //protectec
    try{
      if(!(Number(req.body.company_id ))|| !req.body.date || !req.body.close){
        return res.status(400).json({
        message:"company_id,date and close are required"
        })
      }

    
    const DailyStocks = await prisma.daily_stock.create({
    data: {
        company_id: Number(req.body.company_id),
        date: new Date(req.body.date),
        close: Number(req.body.close)
    }
    })
    res.json(DailyStocks)
  }
  catch(error){
    res.status(500).json({
      message:"internal server error"
    })
    
  }
})
router.put('/:id', authMiddleware, async (req,res) =>{ 
  try{ ///proctecte
    const DailyStock = await prisma.daily_stock.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
    company_id:Number(req.body.company_id),
    date: new Date(req.body.date),
    close:Number(req.body.close),
    }
  })
    res.json(DailyStock)
    if(!DailyStock){
      return res.status(404).json({
        message:"Stock not found"
      })
    
    }
  }catch(error){
    return res.status(500).json({
      message:"Internal server error"
    })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
try{
  const DailyStocks = await prisma.daily_stock.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!DailyStocks) {
    return res.status(404).json({
      message: "Stock not found"
    })
  }

  await prisma.daily_stock.delete({
    where: {
      id: Number(req.params.id)
    }
  })

  res.json({
    message: `deleted stock ${req.params.id}`
  })
}catch(error){
  return res.status(500).json({
    message:"Internal server error"
  })
}
}) 
export default router 