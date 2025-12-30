'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Users, 
  FileText, 
  Download,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface GDPRRequest {
  id: string
  type: 'access' | 'deletion' | 'rectification' | 'portability'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  user_email: string
  user_name: string
  created_at: string
  processed_at?: string
  notes?: string
}

interface ConsentStats {
  total: number
  accepted: number
  declined: number
  pending: number
}

export default function AdminGDPRPage() {
  const router = useRouter()
  const { isAdminAuthenticated } = useAdmin()
  const [requests, setRequests] = useState<GDPRRequest[]>([])
  const [stats, setStats] = useState<ConsentStats>({ total: 0, accepted: 0, declined: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    if (!isAdminAuthenticated) {
      router.push('/ciprel-admin')
      return
    }

    // Simuler le chargement des données RGPD
    // En production, cela viendrait de l'API
    setLoading(false)
    setStats({
      total: 150,
      accepted: 142,
      declined: 5,
      pending: 3
    })
    setRequests([])
  }, [isHydrated, isAdminAuthenticated, router])

  const getStatusBadge = (status: GDPRRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><RefreshCw className="w-3 h-3 mr-1" />En cours</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complétée</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>
    }
  }

  const getTypeBadge = (type: GDPRRequest['type']) => {
    switch (type) {
      case 'access':
        return <Badge className="bg-purple-100 text-purple-700">Accès</Badge>
      case 'deletion':
        return <Badge className="bg-red-100 text-red-700">Suppression</Badge>
      case 'rectification':
        return <Badge className="bg-orange-100 text-orange-700">Rectification</Badge>
      case 'portability':
        return <Badge className="bg-blue-100 text-blue-700">Portabilité</Badge>
    }
  }

  if (!isHydrated) {
    return null
  }

  if (!isAdminAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-ciprel-600" />
            Gestion RGPD
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de données personnelles et les consentements
          </p>
        </div>
        
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-ciprel-600" />
        </div>
      ) : (
        <>
          {/* Statistiques des consentements */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consentements Acceptés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consentements Refusés</p>
                    <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demandes RGPD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Demandes RGPD
              </CardTitle>
              <CardDescription>
                Liste des demandes d'accès, de suppression, de rectification et de portabilité des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.user_name}</p>
                            <p className="text-sm text-gray-500">{request.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(request.type)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune demande RGPD
                  </h3>
                  <p className="text-gray-500">
                    Les demandes des utilisateurs concernant leurs données personnelles apparaîtront ici.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations légales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Rappel Obligations RGPD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Délais de réponse</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Demande d'accès : 1 mois maximum</li>
                    <li>Demande de suppression : 1 mois maximum</li>
                    <li>Demande de rectification : réponse immédiate si possible</li>
                    <li>Demande de portabilité : 1 mois maximum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Conserver un registre des traitements</li>
                    <li>Documenter les mesures de sécurité</li>
                    <li>Archiver les preuves de consentement</li>
                    <li>Notifier les violations dans les 72h</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
