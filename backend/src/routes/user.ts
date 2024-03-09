import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify,  } from 'hono/jwt'
import{ signUpInput } from '@a.b.h.i_87/medium-common2';
 

const userRouter = new Hono();
userRouter.post('/signup', async(c) => {
    const body = await c.req.json();
    const { success } = signUpInput.safeParse(body);
    if(!success) {
        return c.text('Invalid cred')
    }
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name,
        }
      });
      //@ts-ignore
      const token = await sign({id: user.id}, c.env.JWT_TOKEN);
      return c.json({token});
  
    } catch(e){
        console.log(e);
      c.status(411);
      return c.text('error when signed up');
    }
    
})
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try{
        const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password,
        }
        });
        if(!user) {
        c.status(403);
        return c.json({error: "user not found"});
        }
        //@ts-ignore
        const token = await sign({id: user.id}, c.env.JWT_TOKEN)
        return c.json({token});
    } catch(e) {
        c.status(411);
        return c.text('Invalid');
    }
});

export default userRouter;