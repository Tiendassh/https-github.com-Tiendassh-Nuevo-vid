import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb, addConnectionLog, incrementRequestCount, BotVideo } from "@/lib/serverDb";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  incrementRequestCount();

  try {
    const db = getDb();
    
    // Add health check/sync connection log
    addConnectionLog(
      'SYNC', 
      'SUCCESS', 
      'Cliente web sincronizó videos e historial de conexiones', 
      Date.now() - startTime
    );

    return NextResponse.json({
      success: true,
      videos: db.videos,
      logs: db.logs,
      serverRequests: db.serverRequests,
      status: 'HEALTHY',
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version
    });
  } catch (error: any) {
    addConnectionLog(
      'SYNC', 
      'ERROR', 
      `Fallo en la sincronización del cliente: ${error.message || 'Error desconocido'}`, 
      Date.now() - startTime
    );
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  incrementRequestCount();

  try {
    const { title, url, author, category, description } = await req.json();

    if (!url) {
      addConnectionLog(
        'WEB_WRITE',
        'ERROR',
        'Intento de inyección web fallido: URL vacía o inválida',
        Date.now() - startTime
      );
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const db = getDb();
    const newVideo: BotVideo = {
      id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      title: title || `Vídeo Secreto #${db.videos.length + 1}`,
      url: url,
      author: author || 'Explorador Nocturno',
      category: category || 'Infiltrado / Secreto 🔒',
      description: description || 'Video integrado mediante canal invisible de inyección directa.',
      isCustom: true,
      addedAt: new Date().toISOString(),
      source: 'web'
    };

    db.videos.push(newVideo);
    saveDb(db);

    addConnectionLog(
      'WEB_WRITE',
      'SUCCESS',
      `Vídeo "${newVideo.title}" inyectado exitosamente desde la web`,
      Date.now() - startTime
    );

    return NextResponse.json({ success: true, video: newVideo });
  } catch (error: any) {
    addConnectionLog(
      'WEB_WRITE',
      'ERROR',
      `Fallo en inserción de video web: ${error.message || 'Error desconocido'}`,
      Date.now() - startTime
    );
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
