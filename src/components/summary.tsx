import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { PendingGoals } from './pending-goal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteGoalCompletion } from '../http/delete-goal-completion'

dayjs.locale(ptBR)

export function Summary() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 segundos - qto tempo em milessegundos quero considerar que esse dado não é obsoleto
  })
  if (!data) {
    return null
  }

  const firstDayOfWeek = dayjs().startOf('week').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('D MMM')

  const completedPercentage = Math.round((data.completed * 100) / data.total)

  async function handleDeleteGoalCompletion(goalId: string) {
    await deleteGoalCompletion(goalId)

    queryClient.invalidateQueries({ queryKey: ['summary'] }) //atualizar o carregamento de summary
    queryClient.invalidateQueries({ queryKey: ['pendingGoals'] })
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={15} value={8}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de{' '}
            <span className="text-zinc-100">{data?.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />
      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {Object.entries(data.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const formatedDate = dayjs(date).format('D[ de ]MMMM')

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium ">
                <span className="capitalize">{weekDay} </span>
                <span className="text-zinc-400 text-xs">({formatedDate})</span>
              </h3>
              <ul className="flex flex-col gap-3">
                {goals.map(goal => {
                  const time = dayjs(goal.completedAt).format('HH:mm')
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className=" flex - flex-row text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" às{' '}
                        <span className="text-zinc-100">{time}h</span>
                        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                        <p
                          onClick={() => handleDeleteGoalCompletion(goal.id)}
                          className="ml-1 underline cursor-pointer text-zinc-500"
                        >
                          Desfazer
                        </p>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
