import { NextRequest } from 'next/server';

 const handler = async (req: NextRequest) => {
    console.log(req.body)
    }

export { handler as GET }