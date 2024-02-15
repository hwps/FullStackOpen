const dummy = ( blogs ) => {
    return 1
}

const totalLikes = ( blogs ) => {
    const reducer = ( total, blog ) => {
        return total + blog.likes
    }
    
    return blogs.reduce( reducer, 0 )
}

const favoriteBlog = ( blogs ) => {
    const reducer = ( prevFav, blog ) => {
        return prevFav.likes > blog.likes ? prevFav : blog
    }

    return blogs.reduce( reducer )

}


const mostBlogs = ( blogs ) => {
    let blogsPerAuthor = {}

    blogs.forEach( blog => {
        const author = blog.author
        if ( Object.keys(blogsPerAuthor).includes(author) ) 
            blogsPerAuthor[author] += 1
        else
            blogsPerAuthor[author] = 1
    })

    let mostBlogsObj = {
        "author": '',
        "blogs": 0 
    }


    for (const [author, blogs] of Object.entries(blogsPerAuthor)) {
        if (blogs > mostBlogsObj.blogs) {
            mostBlogsObj.blogs = blogs
            mostBlogsObj.author = author
        }
    }

    return mostBlogsObj
} 



const mostLikes = ( blogs ) => {
    let likesPerAuthor = {}

    blogs.forEach( blog => {
        const author = blog.author
        if ( Object.keys(likesPerAuthor).includes(author) ) 
            likesPerAuthor[author] += blog.likes
        else
            likesPerAuthor[author] = blog.likes
    })

    let mostLikesObj = {
        "author": '',
        "likes": 0 
    }

    for (const [author, likes] of Object.entries(likesPerAuthor)) {
        if (likes > mostLikesObj.likes) {
            mostLikesObj.likes = likes
            mostLikesObj.author = author
        }
    }

    return mostLikesObj
} 

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes  }