"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package } from "lucide-react"

const receivers = [
  "Helsinki Food Bank",
  "Pelastusarmeija",
  "Ruokajakelu Helsinki",
  "Helsinki Missio",
  "Hyvä Jää Hyötykäyttöön",
]

const foodTypes = [
  "Fresh produce",
  "Bakery items",
  "Prepared meals",
  "Dairy products",
  "Meat & poultry",
  "Other",
]

interface LogDonationDialogProps {
  trigger?: React.ReactNode
  onDonationLogged?: (donation: {
    donor: string
    receiver: string
    amount: string
    foodType?: string
    notes?: string
  }) => void
}

export function LogDonationDialog({ trigger, onDonationLogged }: LogDonationDialogProps) {
  const [open, setOpen] = useState(false)
  const [donor, setDonor] = useState("")
  const [receiver, setReceiver] = useState("")
  const [amount, setAmount] = useState("")
  const [foodType, setFoodType] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!donor.trim() || !receiver || !amount || parseFloat(amount) <= 0) {
      return
    }

    onDonationLogged?.({
      donor,
      receiver,
      amount: `${amount} kg`,
      foodType: foodType || undefined,
      notes: notes || undefined,
    })

    // Reset form
    setDonor("")
    setReceiver("")
    setAmount("")
    setFoodType("")
    setNotes("")
    setOpen(false)
  }

  const handleCancel = () => {
    setDonor("")
    setReceiver("")
    setAmount("")
    setFoodType("")
    setNotes("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Log Donation
          </DialogTitle>
          <DialogDescription>
            Record a new food donation from industry partners
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="donor">Donor Name *</Label>
            <Input
              id="donor"
              placeholder="e.g., S-Market Hakaniemi"
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver *</Label>
            <Select value={receiver} onValueChange={setReceiver}>
              <SelectTrigger id="receiver">
                <SelectValue placeholder="Select receiver" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((rec) => (
                  <SelectItem key={rec} value={rec}>
                    {rec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Weight (kg) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                min="0"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodType">Food Type</Label>
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger id="foodType">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {foodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional details (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Log Donation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

