import { capitalCase } from 'change-case';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, Button, Divider } from '@mui/material';

import Iconify from '../../components/Iconify';
import { auth } from '../../firebase';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
}

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  const { loginGoogle } = useAuth();
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn().then(async (result) => {
        const currentUser = result.user;
        console.log(currentUser.accessToken);
        await loginGoogle(currentUser.accessToken);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Image
              visibleByDefault
              disabledEffect
              alt="login"
              src="https://firebasestorage.googleapis.com/v0/b/cleaninghouseservice-23aa3.appspot.com/o/iCleanPNG.png?alt=media&token=b27bf36d-c31b-44be-8c03-0aae936b2d0b"
            />
            <Image visibleByDefault disabledEffect alt="login" src="/assets/illustrations/illustration_login.png" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to iClatt
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              </Box>

              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://firebasestorage.googleapis.com/v0/b/cleaninghouseservice-23aa3.appspot.com/o/logo.png?alt=media`}
                    sx={{ width: 50, height: 50 }}
                  />
                </>
              </Tooltip>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleGoogleSignIn}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>
            </Stack>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
