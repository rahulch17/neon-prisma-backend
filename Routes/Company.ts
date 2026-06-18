import { prisma } from '../prisma'
import { Router } from 'express'
import {authMiddleware} from '../middleware/auth'

const router = Router()

router.get('/', async(req,res) =>{     
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3           //public
    const company = await prisma.company.findMany({
          skip: (page - 1) * limit,
          take: limit
    })

    res.json(company)
})

router.get('/:id', async (req,res) =>{         //public route
    const company = await prisma.company.findUnique({
      where:{
        id: Number(req.params.id)
      }
    })
      res.json(company)
    })

router.post('/', authMiddleware, async (req, res) => {     //protected
    console.log(req.body)
   const company= await prisma.company.create({
    data: {
      name: req.body.name,
      symbol: req.body.symbol
    }
  })

  res.json(company)
})

router.put('/:id', authMiddleware, async (req,res) =>{ ///proctected
    const company=await prisma.company.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
    name: req.body.name,
     symbol: req.body.symbol
    }
  })
    res.json(company)
})

router.delete('/:id', authMiddleware, async (req,res) =>{ //protected
    await prisma.company.delete({
    where: {
      id: Number(req.params.id)
    }
  })
    res.json({
        message:`deleted company ${req.params.id}`
    })
})      



export default router