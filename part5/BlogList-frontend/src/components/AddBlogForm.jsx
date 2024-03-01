const AddBlogForm = ({addBlogListEntry}) => {
  
  const newBlog = async (event) => {
    event.preventDefault()

    // opted not to use React state here to cut down on re-renders
    const formData = new FormData(event.currentTarget)
    const form = {}
    for (const [key, val] of formData.entries()) form[key] = val
    //console.log(form)
    event.target.reset()

    const newBlogData = {title: form.title, author: form.author, url: form.url}

    addBlogListEntry(newBlogData)


  }

  return (
    <form onSubmit={newBlog}>
      <div>Title: <input type="text" name="title"/></div>
      <div>Author: <input type="text" name="author"/></div>
      <div>URL: <input type="text" name="url"/></div>
      <button type="submit">Add Blog</button>
    </form>
  )
}

export default AddBlogForm