<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'regex:/^[0-9+\s-]{7,20}$/'],
            'subject' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب ولا يقل عن حرفين.',
            'email.required' => 'الرجاء إدخال بريد إلكتروني صحيح.',
            'phone.required' => 'رقم الهاتف مطلوب ولا يقل عن 7 أرقام.',
            'phone.regex' => 'رقم الهاتف غير صحيح (7 إلى 20 رقماً).',
            'message.required' => 'الرسالة مطلوبة (10 إلى 3000 حرف).',
        ];
    }
}
