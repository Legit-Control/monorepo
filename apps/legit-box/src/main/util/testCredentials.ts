export const testCredentials = async (args: {
  repoUrl: string
  user: string
  token: string
}): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `https://api.github.com/repos/${args.repoUrl.split('/')[3]}/${args.repoUrl.split('/')[4]}`,
    {
      headers: {
        Authorization: `token ${args.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status: ${response.status}`)
  }

  // Check if the user can access the repository
  const permissionsResponse = await fetch(
    `https://api.github.com/repos/${args.repoUrl.split('/')[3]}/${args.repoUrl.split('/')[4]}`,
    {
      headers: {
        Authorization: `token ${args.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }
  )

  if (!permissionsResponse.ok) {
    throw new Error(`GitHub API request failed with status: ${permissionsResponse.status}`)
  }

  const repoData = await permissionsResponse.json()

  // Check if the user has push access
  if (repoData.permissions?.push) {
    return { success: true, message: 'User has read and write access to the repository.' }
  } else {
    return { success: false, message: 'User does not have write access to the repository.' }
  }
}
