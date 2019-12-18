import React, { Fragment } from 'react'
import {
    EuiFlexGroup,
    EuiText,
    EuiHorizontalRule,
    EuiFlexItem,
    EuiSpacer
} from "@elastic/eui";
import { Link } from 'react-router-dom';
import { FaComments } from "react-icons/fa";
const PostItem = ({ post: { _id, title, content, user: { name }, comments } }) => {
    return (
        <Fragment>
            <EuiFlexGroup style={{ padding: '2% 1%' }} key={_id} wrap={true}>
                <Link to={`/posts/${_id}`} style={{ color: 'black' }}>
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiText>
                                <h1 style={{ fontWeight: '500' }}>{title}</h1>
                            </EuiText>
                            <EuiText grow={true}>
                                <p>By <span style={{ fontWeight: '500' }}>{name}</span>
                                    <span style={{ float: 'right', textTransform: 'uppercase', color: 'grey' }}>
                                        {comments.length} <FaComments /> {" "}
                                        {Math.ceil(content.length / 1250)} min read
                                    </span>
                                </p>
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer size='s' />
                    <EuiFlexItem>
                        <EuiText size='m'>
                            <p>{content.length > 400 ? `${content.substring(0, 400)}...` : content}</p>{/* MAKE CONTENT SHOW ONLY CERTAIN LENGTH */}
                        </EuiText>
                    </EuiFlexItem>
                </Link>
            </EuiFlexGroup>
            <EuiHorizontalRule />
        </Fragment>
    )
}


export default PostItem
