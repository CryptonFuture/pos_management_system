from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="POS Analytics Service",
    description="Python FastAPI microservice for POS reports & analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SalesPrediction(BaseModel):
    product_name: str
    historical_sales: List[float]

@app.get("/")
def root():
    return {
        "service": "POS Python Analytics Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/reports/daily-summary")
async def daily_summary():
    return {
        "success": True,
        "data": {
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "total_sales": 42,
            "total_revenue": 87500,
            "average_ticket": 2083.33,
            "top_selling": [
                {"name": "Coca Cola 1.5L", "qty": 18, "revenue": 3240},
                {"name": "Lays Classic 50g", "qty": 25, "revenue": 1250},
                {"name": "Cooking Oil 1L", "qty": 8, "revenue": 3600}
            ],
            "payment_methods": {
                "cash": 52000,
                "card": 28000,
                "mobile": 7500
            },
            "generated_by": "Python FastAPI"
        }
    }

@app.get("/reports/inventory-health")
async def inventory_health():
    return {
        "success": True,
        "data": {
            "total_products": 10,
            "low_stock_count": 1,
            "out_of_stock": 0,
            "inventory_value": 185000,
            "health_score": 88,
            "alerts": [
                "Hand Sanitizer stock is below minimum (6 / 10)"
            ],
            "recommendations": [
                "Reorder Hand Sanitizer soon",
                "Beverages are selling fast — consider restocking Coca Cola"
            ]
        }
    }

@app.post("/predict/sales")
async def predict_sales(data: SalesPrediction):
    if len(data.historical_sales) < 3:
        return {"success": False, "message": "Need at least 3 data points"}

    avg = sum(data.historical_sales[-3:]) / 3
    trend = (data.historical_sales[-1] - data.historical_sales[-3]) / 2
    prediction = max(0, round(avg + trend, 1))

    return {
        "success": True,
        "product": data.product_name,
        "historical": data.historical_sales,
        "predicted_next": prediction,
        "method": "3-period moving average + trend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
