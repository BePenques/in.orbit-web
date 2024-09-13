import { Dialog } from './components/ui/dialog'

import { Summary } from './components/summary'
import { EmptyGoals } from './components/empty-goals'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/get-summary'

export function App() {
  // const [summary, setSummary] = useState<SummaryType | null>(null)

  // useEffect(() => {
  //   fetch('http://localhost:3333/summary')
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       setSummary(data.summary)
  //     })
  // }, [])

  //https://tanstack.com/query/latest/docs/framework/react/quick-start
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 segundos - qto tempo em milessegundos quero considerar que esse dado não é obsoleto
  })

  return (
    <Dialog>
      {data?.total && data?.total > 0 ? <Summary /> : <EmptyGoals />}
    </Dialog>
  )
}
