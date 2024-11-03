
// export default function PollCreateTab() {
//     const [comment, setComment] = useState("")
  
//     return (
//       <Tabs defaultValue="new-comment">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="new-comment" className="flex items-center gap-2">
//             <MessageSquare className="h-4 w-4" />
//             Comment
//           </TabsTrigger>
//           <TabsTrigger value="comment-history" className="flex items-center gap-2">
//             <History className="h-4 w-4" />
//             Comment History
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="new-comment" className="space-y-4 mt-4">
//           {/* New comment form content */}
//           {/* ... (rest of the new comment form code) ... */}
//         </TabsContent>
//         <TabsContent value="comment-history" className="mt-4">
//           {/* Comment history content */}
//           {/* ... (rest of the comment history code) ... */}
//         </TabsContent>
//       </Tabs>
//     )
//   }