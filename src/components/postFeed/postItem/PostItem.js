import classes from './PostItem.module.scss';

function PostItem({post}) {



    return (<div className={classes.container}>

        <div className={classes.text}>
            {post.text}
        </div>
    </div>);
}

export default PostItem;