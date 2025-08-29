import { Button } from "@mui/material";
import { GithubIcon } from "lucide-react";
import { githubSignIn } from "@/app/actions/github-sing-in";

const GithubSignIn = () => {
    return (
        <form
            action={githubSignIn}
        >
            <Button className="w-full" variant="outlined" type="submit">
                <GithubIcon />
                Continue with GitHub
            </Button>
        </form>
    );
};

export { GithubSignIn };