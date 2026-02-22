import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />
      
      <Card className="w-full max-w-md bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl relative">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-destructive mb-4">
            404
          </CardTitle>
          <CardTitle className="text-2xl">
            Страница не найдена
          </CardTitle>
          <CardDescription>
            Запрашиваемая страница не существует или была перемещена
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex justify-center">
          <Link to="/">
            <Button className="backdrop-blur">
              Вернуться на главную
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}