import * as React from "react";
import { GitHubUserData } from "../modules/user";

interface GitHubUserPreviewProps {
    user: GitHubUserData;
    error: string;
}

class GitHubUserPreview extends React.Component<GitHubUserPreviewProps, {}> {
    constructor(props: GitHubUserPreviewProps) {
        super(props);
    }
    render(): JSX.Element {
        const { user, error }: GitHubUserPreviewProps = this.props;
        if (user) {
            const { avatar_url, login, name, bio, email }: GitHubUserData = user;
            return <div className="github-preview">
                <img src={avatar_url} alt={`${login}'s face`} className="face" />
                <h3><b>{name}</b> {login}</h3>
                <h4>{email ? email : <i>Email not shown</i>}</h4>
                <p>{bio ? bio : <i>Bio empty</i>}</p>
            </div>;
        } else {
            return <div className="github-preview">
                <p>{error}</p>
            </div>;
        }
    }
};

export default GitHubUserPreview;
