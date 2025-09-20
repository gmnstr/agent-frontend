import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Body1, Button, Card, CardHeader, Title2 } from '@fluentui/react-components'

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  let message = 'Something went wrong.'

  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Card appearance="filled" style={{ maxWidth: '28rem' }}>
        <CardHeader header={<Title2>Error loading page</Title2>} />
        <Body1 role="alert">{message}</Body1>
        <Button appearance="primary" style={{ marginTop: '1.5rem' }} onClick={() => window.location.assign('/') }>
          Go home
        </Button>
      </Card>
    </div>
  )
}
