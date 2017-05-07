import * as React from 'react';
import { IGitHubUserData } from '../modules/user';

interface IGitHubUserPreviewProps {
    user: IGitHubUserData;
    error: string;
}

class GitHubUserPreview extends React.Component<IGitHubUserPreviewProps, {}> {
    constructor(props: IGitHubUserPreviewProps) {
        super(props);
    }
    render(): JSX.Element {
        const { user, error }: IGitHubUserPreviewProps = this.props;
        if (user) {
            const { avatar_url, login, name, bio, email }: IGitHubUserData = user;
            return (
                <div className="github-preview">
                    <img src={avatar_url} alt={`${login}'s face`} className="face" />
                    <h3><b>{name}</b> {login}</h3>
                    <h4>{email ? email : <i>Email not shown</i>}</h4>
                    <p>{bio ? bio : <i>Bio empty</i>}</p>
                </div>
            );
        } else {
            return (
                <div className="github-preview">
                    <p>{error}</p>
                </div>
            );
        }
    }
}

export default GitHubUserPreview;
