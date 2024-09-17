export async function deleteGoalCompletion(id: string): Promise<boolean> {
  await fetch(`http://localhost:3333/delete-goal-completion/${id}`, {
    method: 'DELETE',
  })

  return true
}
