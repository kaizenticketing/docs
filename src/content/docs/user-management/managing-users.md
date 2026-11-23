---
title: Managing Users
description: How to create a box office user, how they finish setting up their sign-in, and how long they stay signed in.
sidebar:
  order: 1
---

Everyone who uses the box office signs in as their own user. This page covers creating a user, how the user finishes setting up their sign-in, and how long they stay signed in.

## Create a user

With the club's organisation selected at the top left, go to **Users** in the top menu and click **New**.

![The Users list, with the New button at the top right](/user-management/users-list.png)

### Username

The username can be the person's email address or a username you choose.

- If the club has more than one organisation, use a username, not their email address.
- The box office and reports show the user's display name - their first and last name - not their username.

### Email address

An email address can belong to one user only. If you enter one that is already in use, you see a message saying that the user already exists.

### How the user sets up their sign-in

When you create the user, choose one of these:

| Option | What happens | Use it for |
| :--- | :--- | :--- |
| **Send an invitation E-Mail for authentication setup and E-Mail verification** | The user gets an invitation email and chooses their own password. | Clubs. This is the usual choice. |
| **Set an initial password for the User** | You set the user's password when you create them. | Clubs with more than one shared box office matchday account. |
| **Setup authentication later for this user** | The user gets an invitation email and chooses their own password. | |

**E-mail Verified** is greyed out with either of the first two options, so you can leave it as it is.

## The user page

Click a user in the **Users** list to open their page.

![A user's page](/user-management/user-page.png)

Along the top:

- **Status** - whether the user can sign in. **Active** means they can.
- **User ID** - the user's unique number.
- **Created** and **Changed** - when the user was created and last changed.
- **Login methods** - the username and email address the user can sign in with.

On the left, the user's settings are split into tabs:

- **General** - the user's profile and contact details, below.
- **Password and Security** - the user's password and other sign-in security.
- **Identity Providers** - any other accounts linked to the user to sign in with. Nothing to do here, as we don't use legacy anymore.
- **Role Assignments** - the user's roles, which decide what they see in the box office.
- **Administrator Roles** - shows if the user is a manager or owner of any club or project.
- **Metadata** - extra details stored against the user.

**Profile** holds the user's details. Click **Save** after changing any of them.

- **User Name** - what the user signs in with. Click **modify** to change it.
- **First Name** and **Last Name** - the user's name.
- **Nickname** - optional.
- **Display Name** - the name the box office and reports show.
- **Gender** and **Language** - optional.

**Contact Information** holds the user's email address and phone number. Password reset emails go to this address, and **Email verified** shows that the user has confirmed it. Click the pencil to change either.

**Last Changes**, on the right, lists what has happened to the user most recently, such as each time they signed in with their password.

## What the new user does

With an invitation, the user:

1. Opens the invitation email. It holds a verification code and an **Accept Invite** button.
2. Clicks **Accept Invite**. If the page asks for a code, they enter the one from the email.
3. Chooses a password.

The verification code is valid for 60 minutes. If it has expired, the user can send themselves a new one.

## Give the user a role

A new user sees nothing in the box office until they have a role. See [Box Office Roles and Permissions](/user-management/box-office-roles-and-permissions/) for what each role can see and do.

## Staying signed in

A box office session lasts 12 hours. After that, the user is signed out and signs in again.
