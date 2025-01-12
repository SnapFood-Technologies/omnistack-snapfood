"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Clock, MapPin, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface PreviewItem {
  name: string
  price: string
  image: string
  rating?: number
  time: string
  distance?: string
  discount?: string
  isFavorite?: boolean
  description: string
}

export function MenuPreview() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSeeAll = (section: 'popular' | 'recent') => {
    router.push(`/admin/restaurants/1/menu/manage`)
  }

  const popularDishes: PreviewItem[] = [
    {
      name: "Cheese Pizza",
      price: "250.00",
      image: "/images/dummy/pizza-dummy.jpg",
      rating: 4.8,
      time: "25 - 30 min",
      discount: "15% Off",
      description: "Classic pizza with melted mozzarella and tomato sauce"
    },
    {
      name: "Hawaiian Pizza",
      price: "350.00",
      image: "/images/dummy/pizza-dummy.jpg",
      rating: 5,
      time: "25 - 30 min",
      discount: "10% Off",
      description: "Sweet and savory combination of ham and pineapple"
    },
    {
      name: "Delicious Burger",
      price: "200.00",
      image: "/images/dummy/pizza-dummy.jpg",
      rating: 4.8,
      time: "25 - 30 min",
      discount: "15% Off",
      description: "Juicy beef patty with fresh vegetables and special sauce"
    },
    {
      name: "Classic Burger",
      price: "220.00",
      image: "/images/dummy/pizza-dummy.jpg",
      rating: 5,
      time: "25 - 30 min",
      discount: "10% Off",
      description: "Traditional burger with lettuce, tomato, and cheese"
    }
  ]

  const recentOrders: PreviewItem[] = [
    {
      name: "Meat Burger",
      price: "150.00",
      image: "/images/dummy/pizza-dummy.jpg",
      distance: "10 km",
      time: "30 min",
      description: "Double beef patty with crispy bacon and cheddar"
    },
    {
      name: "Pasta with Tomato",
      price: "230.00",
      image: "/images/dummy/pizza-dummy.jpg",
      distance: "15 km",
      time: "45 min",
      description: "Fresh pasta with rich tomato sauce and Italian herbs"
    },
    {
      name: "Fish Burger",
      price: "130.00",
      image: "/images/dummy/pizza-dummy.jpg",
      distance: "8 km",
      time: "25 min",
      description: "Crispy fish fillet with tartare sauce and lettuce"
    },
    {
      name: "Cheese Pizza",
      price: "130.00",
      image: "/images/dummy/pizza-dummy.jpg",
      distance: "12 km",
      time: "35 min",
      description: "Traditional cheese pizza with our special blend of cheeses"
    }
  ]

  const toggleFavorite = (itemName: string) => {
    setFavorites(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const MenuItem = ({ item }: { item: PreviewItem }) => (
    <Card className="group relative bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative">
        {item.discount && mounted && (
          <span className="absolute top-3 left-3 bg-yellow-400/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            {item.discount}
          </span>
        )}
        {mounted && (
          <Button 
            variant="secondary"
            size="icon"
            onClick={() => toggleFavorite(item.name)}
            className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white
              ${favorites[item.name] ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'}`}
          >
            <Heart className={`w-4 h-4 ${favorites[item.name] ? 'fill-current' : ''}`} />
          </Button>
        )}
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="aspect-[4/3]">
            <img 
              src={item.image} 
              alt={item.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>
      <CardContent className="p-4 pt-3">
        <div className="space-y-1 mb-3">
          <p className="text-lg font-semibold tracking-tight">${item.price}</p>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
        {mounted && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              {item.rating ? (
                <>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-yellow-600">
                    {item.rating === 5 ? "5.0" : item.rating}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-600">{item.distance}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{item.time}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Popular Dishes */}
      <Card className="p-0">
        <div className="space-y-6">
          <div className="space-y-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Popular Dishes</h3>
              <Button variant="link"  onClick={() => handleSeeAll('popular')} className="text-primary font-medium">
                See All
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Our most loved and frequently ordered dishes by customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularDishes.map((item, i) => (
              <MenuItem key={i} item={item} />
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-0">
        <div className="space-y-6">
          <div className="space-y-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Button variant="link"  onClick={() => handleSeeAll('recent')} className="text-primary font-medium">
                See All
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Latest orders from our restaurant in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentOrders.map((item, i) => (
              <MenuItem key={i} item={item} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}