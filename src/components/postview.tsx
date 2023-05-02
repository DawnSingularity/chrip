
import { RouterOutputs } from "y/utils/api";
import Image from 'next/image';
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key = {post.id} className="p-4 border-b border-slate-400 flex gap-3">
      <Image 
      src ={author.profileImageUrl} 
      className = "h-14 w-14 rounded-full" 
      alt = {`@${author.username}'s profilepicture`}
      width ={56} 
      height ={56}
      />
      <div className="flex flex-col">
        <div className = "flex text-slate-300 gap-1"> 
          <Link  href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span> 
          </Link >
          <Link  href={`/post/${post.id}`}>
            <span className = "font-thin"> · {dayjs(post.createdAt).fromNow()}</span>
          </Link >
        </div>
        <span className ="text-2xl">{post.content}</span>
      </div>
      
    </div>
  );
};
