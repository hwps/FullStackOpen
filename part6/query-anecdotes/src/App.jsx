import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './components/NotificationContext'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import requests from './requests'


const App = () => {

  // get Notification context
  const notificationDispatch = useNotificationDispatch()

  // upvote callback

  const queryClient = useQueryClient()
  const upvoteAnecdoteMutation = useMutation({ 
    mutationFn: requests.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) 
  })

  const handleVote = (anecdote) => {
    notificationDispatch({ type: "SHOW", payload: {text: `Anecdote '${anecdote.content}' upvoted`, timeout: 5000 }})
    upvoteAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  // get anecdotes on load

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: requests.getAll,
    retry: 1
  })

  // display loading / error msgs

  if (result.isLoading) {
    return <div>loading data...</div>
  } 

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  } 

  const anecdotes = result.data

  return (
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
  )
}

export default App
