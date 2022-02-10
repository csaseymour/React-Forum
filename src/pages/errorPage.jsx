import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function ErrorPage() {
  return <Container>
      <h1>Page not Found!</h1>
  </Container>;
}

export default ErrorPage;
