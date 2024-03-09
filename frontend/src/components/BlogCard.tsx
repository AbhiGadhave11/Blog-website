import { Link } from "react-router-dom";


interface BlogCardProps{
    authorName: string;
    title: string,
    content: string,
    publishedDate: string ,
    id: string
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate 
}: BlogCardProps)=>{
    return<Link to={`/blog/${id}`}> <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen max-w-screen-md cursor-pointer">
        <div className="flex">
            <Avatar authorName={authorName}/>
            <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
                {authorName}
            </div>
            <div className="flex justify-center flex-col pl-2 flex justify-center flex-col">
                <Circle/>
            </div>
            <div className="pl-2 font-thin font-slate-500 flex justify-center flex-col">
                {publishedDate}
            </div>
        </div>
        <div className="text-xl font-semibold ">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0,100) + "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin">
            {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
        <div className="bg-slate-200 h-1 w-full
        text-slate-400">

        </div>
    </div>
    </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-600">

    </div>
}

export function Avatar({authorName}:{authorName: string}){
    return <div>
        <div className="relative inline-flex items-center 
        justify-center w-6 h-6 overflow-hidden bg-gray-600 
        rounded-full">
    <span className="text-x5 font-extralight text-gray-600 
        dark:text-gray-300">
        {authorName[0]}
    </span>
</div>
    </div>
}