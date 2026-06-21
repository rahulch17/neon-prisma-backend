import { prisma } from '../prisma'
import { Router } from 'express'
import {authMiddleware} from '../middleware/auth'

const router = Router()

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 3

  const name = req.query.name as string

  const where = {
    name: name
      ? {
          contains: name,
          mode: 'insensitive' as const
        }
      : undefined
  }

  const total = await prisma.company.count({
    where
  })

  const company = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      symbol: true
    },
    where,
    skip: (page - 1) * limit,
    take: limit
  })

  res.json({
    data: company,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
})  
router.get('/symbol/:symbol', async (req,res) => { 
  try{                                                // get a company details using symbol of a company
    const company = await prisma.company.findUnique({
      where:{
        symbol: req.params.symbol
      }
    })
    if(!company){
      return res.status(404).json({
        message:"company not found having this symbol"
      })
  }
    res.json(company)
}catch(error){
  return res.status(500).json({
    message:"internal server error"
  })
}

  })

router.get('/:id', async (req,res) =>{         //public route
    const company = await prisma.company.findUnique({
      where:{
        id: Number(req.params.id)
      }
    })
    if (!company) {
      return res.status(404).json({
        message: "company not found"
      })
    }
      res.json(company)
    })



router.post('/', authMiddleware, async (req, res) => {     //protected
    console.log(req.body)
    try {
      if (!req.body.name || !req.body.symbol){
      return res.status(404).json({
        message:"name and symbol are required"
      })

    }
   const company= await prisma.company.create({
    data: {
      name: req.body.name,
      symbol: req.body.symbol
    }
  })

  res.json(company)
}catch(error){
  res.status(500).json({
    message:"internal server error"
  })
}
})

router.put('/:id', authMiddleware, async (req,res) =>{
      try{
        if(!req.body.name||!req.body.symbol){
          return res.status(400).json({
            message:"name and symbol required"
          })
          
        }///proctected
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
}
catch(error){
  res.status(500).json({
    message:"internal server error"
  })
}
})

                                                                 //protected
router.delete('/:id', authMiddleware, async (req, res) => {
try{
  const company = await prisma.company.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!company) {
    return res.status(404).json({
      message: "company not found"
    })
  }

  await prisma.company.delete({
    where: {
      id: Number(req.params.id)
    }
  })

  res.json({
    message: `deleted company ${req.params.id}`
  })
}catch(error){
  return res.status(500).json({
    message:"internal server error"
  })
}
})    



export default router