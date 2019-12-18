import React from 'react'
import { EuiCard, EuiFlexItem } from '@elastic/eui'
import { Link } from 'react-router-dom';

const PostCard = ({ post: { _id, title, content } }) => {
    return (
        <EuiFlexItem>
            <Link to={`/posts/${_id}`}>
                <EuiCard
                    textAlign="left"
                    title={title.length > 30 ? `${title.substring(0, 30)}...` : title}
                    description={
                        <span>
                            {content.substring(0, 150)}...
                </span>
                    }>
                </EuiCard>
            </Link>
        </EuiFlexItem>
    )
}

export default PostCard
