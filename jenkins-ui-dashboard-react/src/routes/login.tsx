import React from 'react';

import "@patternfly/react-core/dist/styles/base.css";
const brandImg2 = "https://github.com/patternfly/patternfly-react/raw/main/packages/react-core/src/components/LoginPage/examples/brandImgColor2.svg";
import {
  LoginForm,
  LoginMainFooterLinksItem,
  LoginPage,
  ListVariant,
  BackgroundImage
} from '@patternfly/react-core';
import { useNavigate } from "react-router-dom";

import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';



export default function Login() {
  const navigate = useNavigate();
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

  const handleUsernameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setPassword(value);
  };

  const onRememberMeClick = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
  };

  const onLoginButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
    navigate("/conector");
  };

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Invalid login credentials."
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Username"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      isRememberMeChecked={isRememberMeChecked}
      onChangeRememberMe={onRememberMeClick}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Log in"
    />
  );

  return (
    <>
      <BackgroundImage src="/assets/images/pfbg-icon.svg" />
      <LoginPage
        footerListVariants={ListVariant.inline}
        textContent=""
        loginTitle="Log in to your account"
        loginSubtitle="Enter your single sign-on LDAP credentials."
      >
        {loginForm}
      </LoginPage>
   </>
  );
}