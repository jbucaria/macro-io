require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

let token = null
let tokenExpiryTime = null

// Function to get a new token from Passio
const getToken = async () => {
  try {
    const response = await axios.post(
      `https://api.passiolife.com/v2/token-cache/napi/oauth/token/${process.env.PASSIO_API_KEY}`
    )
    token = response.data.access_token
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000 // expiry in milliseconds
    console.log('Token retrieved successfully')
  } catch (error) {
    console.error('Error retrieving token:', error.message)
  }
}

// Middleware to refresh token if expired
const refreshTokenMiddleware = async (req, res, next) => {
  if (!token || Date.now() >= tokenExpiryTime) {
    await getToken()
  }
  next()
}

// Endpoint to search for food
app.get('/api/search', refreshTokenMiddleware, async (req, res) => {
  const { term } = req.query

  if (!term) {
    return res.status(400).send('Search term is required')
  }

  try {
    const response = await axios.get(
      `https://api.passiolife.com/v2/products/napi/food/search/advanced`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Passio-ID': 'your_passio_customer_id', // You should replace this with your actual Passio customer_id
        },
        params: {
          term,
        },
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error searching for food:', error.message)
    res.status(500).send('Error searching for food')
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
