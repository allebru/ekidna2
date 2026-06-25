import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { submitSubscription } from '../config/api';

export function Iscriviti() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    dataNascita: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    motivazione: '',
    accettaTermini: false,
    accettaPrivacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Map form data to backend format
      const subscriptionData = {
        name: `${formData.nome} ${formData.cognome}`.trim(),
        email: formData.email,
        phone: formData.telefono,
        address: `${formData.indirizzo}, ${formData.citta}, ${formData.cap} ${formData.provincia}`.trim(),
        subscription_year: new Date().getFullYear(),
        notes: `Data di nascita: ${formData.dataNascita}\n\nMotivazione: ${formData.motivazione}`.trim(),
      };

      // Submit to backend API
      const response = await submitSubscription(subscriptionData);

      if (response.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          nome: '',
          cognome: '',
          email: '',
          telefono: '',
          dataNascita: '',
          indirizzo: '',
          citta: '',
          cap: '',
          provincia: '',
          motivazione: '',
          accettaTermini: false,
          accettaPrivacy: false,
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 border-2 border-[#e6332a] p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm shadow-2xl">
          <img
            src="/logo/ekidna-icon.svg"
            alt=""
            aria-hidden="true"
            style={{ height: 'clamp(3.5rem, 8vw, 5rem)' }}
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-[0.15em] text-[#e6332a] mb-6">
            Diventa socio/a/ə di Ekidna
          </h1>
          <div className="h-px w-32 bg-[#e6332a] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La tessera associativa è completamente gratuita
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="border border-[#e6332a]/30 p-8 md:p-12 mb-12 bg-zinc-950/50 shadow-xl">
            <h2 className="text-2xl text-[#e6332a] mb-6 uppercase tracking-[0.15em]">
              Diventa socio/a/ə di Associazione Ekidna
            </h2>
            <div className="h-px w-24 bg-[#e6332a] mb-8"></div>
            <p className="text-gray-400 leading-relaxed mb-6">
              L'Associazione Ekidna è uno spazio autogestito, culturale e indipendente. Per partecipare alle nostre attività, ai concerti, ai nostri eventi e frequentare i nostri spazi è necessario tesserarsi.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              La tessera associativa è <span className="text-[#e6332a]">completamente gratuita</span>, ha validità per l'anno in corso e l'adesione comporta l'accettazione dello Statuto dell'Associazione.
            </p>
            <p className="text-gray-500 text-sm">
              Compila il modulo qui sotto per richiedere la tua tessera associativa gratuita.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="border border-[#e6332a]/30 p-8 md:p-12 bg-zinc-950/50 shadow-xl">
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Nome *
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
                <div>
                  <Label htmlFor="cognome" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Cognome *
                  </Label>
                  <Input
                    id="cognome"
                    name="cognome"
                    type="text"
                    required
                    value={formData.cognome}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Telefono *
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dataNascita" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                  Data di Nascita *
                </Label>
                <Input
                  id="dataNascita"
                  name="dataNascita"
                  type="date"
                  required
                  value={formData.dataNascita}
                  onChange={handleChange}
                  className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                />
              </div>

              <div>
                <Label htmlFor="indirizzo" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                  Indirizzo *
                </Label>
                <Input
                  id="indirizzo"
                  name="indirizzo"
                  type="text"
                  required
                  value={formData.indirizzo}
                  onChange={handleChange}
                  className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="citta" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Città *
                  </Label>
                  <Input
                    id="citta"
                    name="citta"
                    type="text"
                    required
                    value={formData.citta}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
                <div>
                  <Label htmlFor="cap" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    CAP *
                  </Label>
                  <Input
                    id="cap"
                    name="cap"
                    type="text"
                    required
                    value={formData.cap}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                  />
                </div>
                <div>
                  <Label htmlFor="provincia" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                    Provincia *
                  </Label>
                  <Input
                    id="provincia"
                    name="provincia"
                    type="text"
                    required
                    maxLength={2}
                    value={formData.provincia}
                    onChange={handleChange}
                    className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a]"
                    placeholder="MO"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="motivazione" className="text-gray-400 uppercase tracking-[0.1em] text-sm mb-2 block">
                  Perché vuoi far parte di Ekidna?
                </Label>
                <Textarea
                  id="motivazione"
                  name="motivazione"
                  rows={5}
                  value={formData.motivazione}
                  onChange={handleChange}
                  className="bg-black border border-[#e6332a]/30 text-gray-300 focus:border-[#e6332a] resize-none"
                  placeholder="Raccontaci..."
                />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accettaTermini"
                  checked={formData.accettaTermini}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, accettaTermini: checked as boolean }))
                  }
                  className="border border-[#e6332a]/30 data-[state=checked]:bg-[#e6332a] data-[state=checked]:border-[#e6332a]"
                />
                <Label htmlFor="accettaTermini" className="text-gray-400 text-sm leading-relaxed cursor-pointer">
                  Dichiaro di condividere i valori di Ekidna APS (antifascismo, transfemminismo, ecologia, DIY) e accetto lo statuto dell'associazione *
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accettaPrivacy"
                  checked={formData.accettaPrivacy}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, accettaPrivacy: checked as boolean }))
                  }
                  className="border border-[#e6332a]/30 data-[state=checked]:bg-[#e6332a] data-[state=checked]:border-[#e6332a]"
                />
                <Label htmlFor="accettaPrivacy" className="text-gray-400 text-sm leading-relaxed cursor-pointer">
                  Ho letto e accetto la{' '}
                  <a href="#/privacy" target="_blank" className="text-[#e6332a] hover:underline">
                    Privacy Policy
                  </a>{' '}
                  e acconsento al trattamento dei miei dati personali per la gestione dell'iscrizione *
                </Label>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-black border border-green-600 p-4 text-green-500 text-sm uppercase tracking-wider">
                  Grazie! Ti contatteremo presto.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-black border border-red-600 p-4 text-red-500 text-sm uppercase tracking-wider">
                  Errore. Contattaci via email.
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!formData.accettaTermini || !formData.accettaPrivacy || isSubmitting}
                className="w-full bg-[#e6332a] hover:bg-[#c41e17] text-black py-6 uppercase tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e6332a] shadow-lg"
              >
                {isSubmitting ? 'Invio...' : 'Invia'}
              </Button>

              <p className="text-gray-600 text-xs text-center uppercase tracking-wider">
                * Campi obbligatori
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
