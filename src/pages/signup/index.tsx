import AuthForm from '../../components/AuthPage/AuthForm'
import SEO from '../../components/SEO'

const Signup = () => {
  return (
    <>
      <SEO title='Sign up' siteName='Instagram' />
      <AuthForm type='signup' />
    </>
  )
}

export default Signup

Signup.noHeader = true
