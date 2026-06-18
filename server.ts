import express from 'express'
import companyRoutes from './Routes/Company'
import dailyStocksRoutes from './Routes/Daily_stock'

const app=express()
app.use(express.json())

app.use('/Company',companyRoutes)
app.use('/DailyStocks',dailyStocksRoutes)
app.listen(3000, () => {    
    console.log('Server is running on port 3000')
})