'use client'

import { motion } from 'framer-motion'
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

const contactData = [
  {
    icon: Phone,
    titre: "Téléphone",
    info: "+225 27 21 74 74 00",
    description: "Ligne directe RH",
    color: "from-ciprel-green-500 to-ciprel-green-600"
  },
  {
    icon: Mail,
    titre: "Email",
    info: "rh@ciprel.ci",
    description: "Équipe démarche compétence",
    color: "from-ciprel-orange-500 to-ciprel-orange-600"
  },
  {
    icon: MapPin,
    titre: "Adresse",
    info: "Abidjan, Côte d'Ivoire",
    description: "Siège social CIPREL",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Clock,
    titre: "Horaires",
    info: "Lun - Ven : 8h - 17h",
    description: "Support disponible",
    color: "from-purple-500 to-purple-600"
  }
]

const equipeData = [
  {
    nom: "Service Ressources Humaines",
    role: "Coordinateur démarche compétence",
    email: "rh@ciprel.ci",
    domaines: ["Stratégie RH", "Gestion des compétences", "Formation"]
  },
  {
    nom: "Équipe Formation",
    role: "Support technique et pédagogique", 
    email: "formation@ciprel.ci",
    domaines: ["Développement", "Évaluation", "Accompagnement"]
  },
  {
    nom: "Direction Générale",
    role: "Validation et pilotage stratégique",
    email: "direction@ciprel.ci",
    domaines: ["Vision stratégique", "Ressources", "Validation"]
  }
]

export function ContactContent() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    service: '',
    sujet: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation de l'envoi
    console.log('Formulaire soumis:', formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-ciprel-black mb-4">
                Message envoyé !
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Votre message a été transmis à l'équipe RH CIPREL. 
                Nous vous répondrons dans les plus brefs délais.
              </p>

              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="mr-4"
              >
                Envoyer un autre message
              </Button>
              
              <Button onClick={() => window.location.href = '/'}>
                Retour à l'accueil
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ciprel-green-100 text-ciprel-green-800 rounded-full text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Besoin d'aide ?
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-6">
            Contact et{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
              Support
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            L'équipe RH CIPREL est à votre disposition pour vous accompagner 
            dans la démarche compétence et répondre à toutes vos questions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Informations de contact */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-ciprel-black mb-8">
              Informations de contact
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {contactData.map((contact, index) => {
                const Icon = contact.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-ciprel-black mb-2">
                        {contact.titre}
                      </h3>
                      <p className="text-lg font-medium text-gray-800 mb-1">
                        {contact.info}
                      </p>
                      <p className="text-sm text-gray-600">
                        {contact.description}
                      </p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Équipe responsable */}
            <h3 className="text-xl font-bold text-ciprel-black mb-6">
              Équipe responsable
            </h3>
            
            <div className="space-y-4">
              {equipeData.map((membre, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-ciprel-black">
                          {membre.nom}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {membre.role}
                        </p>
                        <p className="text-sm text-ciprel-green-600 mb-3">
                          {membre.email}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {membre.domaines.map((domaine, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-ciprel-green-100 text-ciprel-green-700 rounded-full text-xs"
                            >
                              {domaine}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-ciprel-black mb-6">
                Nous contacter
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      required
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service
                  </label>
                  <Input
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="Votre service chez CIPREL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <Input
                    required
                    value={formData.sujet}
                    onChange={(e) => handleInputChange('sujet', e.target.value)}
                    placeholder="Objet de votre demande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Décrivez votre demande ou question..."
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-600 hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
