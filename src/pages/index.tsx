import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignInButton } from "@clerk/nextjs";
import { api } from "y/utils/api";
import type {RouterOutputs} from "y/utils/api";
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from 'next/link'
import { PageLayout } from "y/components/layout";

dayjs.extend(relativeTime);


const CreatePostWizard = () =>{
  const{user} = useUser();

  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess:()=>{
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) =>{
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to post! Please try again later.");
      }
    }
  });


  if(!user) return null;
  console.log(user);
  return <div className="flex gap-3 w-full">
    <Image 
      src={user.profileImageUrl} 
      alt="Profile Image" 
      className= " h-12 w-12 rounded-full"
      width ={56} 
      height ={56} 
      />
    <input 
    placeholder="whats on ur mind" 
    className = "bg-transparent grow outline-none"
    type="text"
    value={input}
    onChange={(e)=> setInput(e.target.value)}
    onKeyDown = {(e) =>{
      if(e.key === "Enter"){
        e.preventDefault();
        if(input !== ""){
          mutate({content: input});
        }
      }
    }}
    disabled={isPosting}
    />

    {input !== "" && !isPosting && (
      <button onClick={()=> mutate({content: input})}>Post</button>
    )}
    {isPosting && (
      <div className="flex justify-center items-center">
        <LoadingSpinner size={20} />
      </div>
    )}
  </div>
};


type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
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


const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if(postsLoading) return <LoadingPage />;

  if(!data) return <div> Something went wrong</div>;

  return (
    <div className = "flex flex-col">
      {data.map((fullPost) => (
        <PostView{...fullPost} key = {fullPost.post.id}/>
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  //start Fetching asap
  api.posts.getAll.useQuery();

  //return empty div if user isn't loaded
  if(!userLoaded) return <div />
  return (
      <PageLayout>
        <div className = "border-b border-slate-400 p-4 flex">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
        
      </PageLayout>
  );
};

export default Home;
