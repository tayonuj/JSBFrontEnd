<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Contact Message</title>
</head>
<body style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#17233c;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #dbe6f5;border-radius:16px;padding:32px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#1c63d6;font-weight:700;">
            Website Contact Form
        </p>

        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#12233f;">
            New message from {{ $contactData['name'] }}
        </h1>

        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
                <td style="padding:10px 0;width:140px;font-weight:700;color:#12233f;">Name</td>
                <td style="padding:10px 0;color:#5f6f8a;">{{ $contactData['name'] }}</td>
            </tr>
            <tr>
                <td style="padding:10px 0;width:140px;font-weight:700;color:#12233f;">Email</td>
                <td style="padding:10px 0;color:#5f6f8a;">{{ $contactData['email'] }}</td>
            </tr>
        </table>

        <div style="padding:20px;border-radius:14px;background:#f8fbff;border:1px solid #dbe6f5;">
            <p style="margin:0 0 12px;font-weight:700;color:#12233f;">Message</p>
            <p style="margin:0;white-space:pre-line;line-height:1.7;color:#42526b;">{{ $contactData['message'] }}</p>
        </div>
    </div>
</body>
</html>
