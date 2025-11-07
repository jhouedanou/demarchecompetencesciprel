import { NextRequest, NextResponse } from 'next/server'
import motiersData from '@/data/metiers-blocks.json'

export async function GET(request: NextRequest) {
  try {
    console.log('📚 [API /api/metiers] Fetching all metiers blocks')

    // Optionally filter by status
    const { searchParams } = new URL(request.url)
    const onlyActive = searchParams.get('active') === 'true'

    let data = motiersData.metiers

    if (onlyActive) {
      data = data.filter(metier => metier.statut === true)
    }

    // Sort by ordre
    data = data.sort((a, b) => a.ordre - b.ordre)

    return NextResponse.json({
      success: true,
      count: data.length,
      data
    })
  } catch (error) {
    console.error('❌ [API /api/metiers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metiers blocks' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ [API /api/metiers] Update metier block')

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Find and update the metier
    const metierIndex = motiersData.metiers.findIndex(m => m.id === id)

    if (metierIndex === -1) {
      return NextResponse.json(
        { error: 'Metier not found' },
        { status: 404 }
      )
    }

    // Update only the fields provided
    motiersData.metiers[metierIndex] = {
      ...motiersData.metiers[metierIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    console.log(`✅ [API /api/metiers] Metier ${id} updated:`, updateData)

    return NextResponse.json({
      success: true,
      message: 'Metier block updated successfully',
      data: motiersData.metiers[metierIndex]
    })
  } catch (error) {
    console.error('❌ [API /api/metiers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update metier block' },
      { status: 500 }
    )
  }
}
