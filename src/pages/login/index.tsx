import { unstable_getServerSession } from 'next-auth'
import AuthForm from '../../components/AuthPage/AuthForm'
import { nextAuthOptions } from '../api/auth/[...nextauth]'

const Login = () => {
  
  return (
    <AuthForm type='login' />
  )
}

export default Login

Login.noHeader = true

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}
