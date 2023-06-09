require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { Configuration, OpenAIApi } = require('openai');

const app = new Koa();
const router = new Router();
const port = process.env.PORT ;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

router.post('/message', async ctx => {
  const { message } = ctx.request.body;
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
      prompt: message,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    
  });

  ctx.body = {
    message: response.data.choices[0].text
  };
  ctx.status = 200;
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
