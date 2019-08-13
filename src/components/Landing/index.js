import React from 'react';

export default  function LandingPage  ()  {
return  (
    <div>
    <h1 data-testid="header">Landing</h1>
    <p data-testid="content">
        {`The Landing Page is open to everyone,
      even though the user isn't signed in.`}
      </p>
    </div>
  )
}

