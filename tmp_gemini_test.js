const key = 'AIzaSyC1v86RNrigNdziTJFRWJu1X0ybhE5fi0';
(async () => {
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateMessage?key=' + key,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              author: 'user',
              content: [
                {
                  type: 'text',
                  text: 'what is python'
                }
              ]
            }
          ]
        })
      }
    );
    console.log('status', res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
})();
