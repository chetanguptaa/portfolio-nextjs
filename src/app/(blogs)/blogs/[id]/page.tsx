"use client";

import { Blog } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactHtmlParser from "html-react-parser";
import { calculateDate, calculateReadingTime } from "@/lib/calculate";
import { AiOutlineRead, AiOutlineStar } from "react-icons/ai";
import { motion, useScroll, useSpring } from "framer-motion";

const BlogPage = ({ params }: { params: { id: string } }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const id = params.id;
  const [blog, setBlog] = useState<Blog>({
    id: parseInt(id, 10),
    editorState: "loading",
    createdAt: new Date(),
    title: "loading",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getBlog = async () => {
      const response = await axios(`/api/blogs/${id}`);
      if (response.data) {
        setBlog(response.data);
        setLoading(false);
      } else
        setBlog({
          id: -1,
          editorState: "Does not exist",
          createdAt: new Date(),
          title: "",
        });
      return response;
    };
    getBlog();
  }, [id]);
  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-2xl">Loading...</div>
    </div>
  ) : blog.id !== -1 ? (
    <div>
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-500 transform origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-3xl mt-4 md:mt-4 m-auto">
        <div className="bg-white text-justify p-4 md:p-8 flex flex-col justify-center">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-2xl md:text-3xl mb-2 text-center underline">
              {blog.title.toUpperCase()}
            </div>
            <div className="text-sm mr-2 mb-12">
              <p className="text-sm flex float-left">
                <AiOutlineRead className="mr-2 mt-1" />
                {Math.round(
                  Number(calculateReadingTime(blog.editorState).toFixed(1))
                )}{" "}
                min read
              </p>
              <p className="flex float-right text-sm text-rose-500">
                <AiOutlineStar className="mr-2 float-right mt-1" />
                {calculateDate(blog.createdAt.toString())}
              </p>
            </div>
            <div className="prose max-w-full">
              {ReactHtmlParser(blog?.editorState)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl">Blog does not exist</div>
    </div>
  );
};

export default BlogPage;
