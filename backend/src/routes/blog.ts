import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify,  } from 'hono/jwt'
import { createBlogInput } from '@a.b.h.i_87/medium-common2'


const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_TOKEN: string
    },
    Variables:{
        userId: string
    }
}>()

blogRouter.use('/*', async(c, next)=>{
    const header = c.req.header('authorization') || "";
    try{
        const response = await verify(header, c.env.JWT_TOKEN);
        if(response.id) {
            c.set('userId', response.id);
        await next()
        } else {
        c.status(403);
        return c.json({msg: "user not found"})
        }
    } catch(e) {
        c.status(403);
        return c.text("Auth Failed")
    }
    
  });


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        return c.json("Invalid Cred");
    }
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })
    return c.json({
        id: blog.id
    });
});

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        return c.json("Invalid Cred");
    }
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })
    return c.json({
        id: blog.id
    });
});

//Todo: Add pagination
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
        const blogs = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author:{
                    select:{
                        name: true
                    }
                }
            }
        });
        return c.json({
            blogs
        });
    } catch(e) {
        c.json(
            { error: "error while fetching"}
        )
    }
});

blogRouter.get('/:id', async(c) => {
    const id =  c.req.param('id');
    const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try{
        const blog = await prisma.post.findFirst({
            where:{
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select:{
                        name: true
                    }
                }
            }
        })
        if(blog){
            return c.json({
                blog
            });
        }
    } catch(e) {
        c.status(411);
        return c.json({
            error: "error while fetching posts"
        })
    }
});


export default blogRouter;